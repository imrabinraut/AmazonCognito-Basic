using System.Security.Cryptography;
using System.Text;
using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Extensions.CognitoAuthentication;
using Amazon.Runtime;

namespace server.Services
{
    public class CognitoAuthService
    {
        private readonly AmazonCognitoIdentityProviderClient _provider;
        private readonly CognitoUserPool _userPool;
        private readonly string _clientId;
        private readonly string _clientSecret;

        public CognitoAuthService(IConfiguration configuration)
        {
            _clientId = configuration["AWSSetting:ClientId"];
            _clientSecret = configuration["AWSSetting:ClientSecret"];
            var userPoolId = configuration["AWSSetting:UserPoolId"];
            var region = configuration["AWSSetting:Region"];
            var credentials = new BasicAWSCredentials(configuration["AWSSetting:AccessKey"], configuration["AWSSetting:SecretKey"]);
            _provider = new AmazonCognitoIdentityProviderClient(credentials, RegionEndpoint.GetBySystemName(region));
            _userPool = new CognitoUserPool(userPoolId, _clientId, _provider);
        }

        public async Task<string> SignUpAsync(string userName, string password, string email)
        {
            var secretHash = CalculateSecretHash(userName, _clientId, _clientSecret);
            var signUpRequest = new SignUpRequest
            {
                ClientId = _clientId,
                Username = userName,
                Password = password,
                SecretHash = secretHash,
                UserAttributes = new List<AttributeType>
                {
                    new AttributeType
                    {
                        Name = "email",
                        Value = email
                    }
                }
            };

            try
            {
                var response = await _provider.SignUpAsync(signUpRequest);
                return response.UserSub;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Sign-up failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ResendConfirmationCodeAsync(string userName)
        {
            var secretHash = CalculateSecretHash(userName, _clientId, _clientSecret);
            var resendRequest = new ResendConfirmationCodeRequest
            {
                ClientId = _clientId,
                Username = userName,
                SecretHash = secretHash
            };

            try
            {
                await _provider.ResendConfirmationCodeAsync(resendRequest);
                return "Confirmation code sent";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Resend confirmation failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ConfirmSignUpAsync(string userName, string confirmationCode)
        {
            var secretHash = CalculateSecretHash(userName, _clientId, _clientSecret);
            var confirmSignUpRequest = new ConfirmSignUpRequest
            {
                ClientId = _clientId,
                Username = userName,
                ConfirmationCode = confirmationCode,
                SecretHash = secretHash
            };

            try
            {
                await _provider.ConfirmSignUpAsync(confirmSignUpRequest);
                return "Confirmation successful";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Confirmation failed: " + ex.Message);
                return null;
            }
        }

        public async Task<Tuple<string, string>> SignInAsync(string userName, string password)
        {
            var user = new CognitoUser(userName, _clientId, _userPool, _provider, _clientSecret);
            var authRequest = new InitiateSrpAuthRequest { Password = password };

            try
            {
                var authResponse = await user.StartWithSrpAuthAsync(authRequest).ConfigureAwait(false);
                return new Tuple<string, string>(authResponse.AuthenticationResult.AccessToken, authResponse.AuthenticationResult.RefreshToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Authentication failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> RefreshTokenAsync(string userName, string refreshToken)
        {
            var secretHash = CalculateSecretHash(userName, _clientId, _clientSecret);
            var request = new InitiateAuthRequest
            {
                AuthFlow = AuthFlowType.REFRESH_TOKEN_AUTH,
                ClientId = _clientId,
                AuthParameters = new Dictionary<string, string>
                {
                    {"REFRESH_TOKEN", refreshToken},
                    {"SECRET_HASH", secretHash}
                }
            };

            try
            {
                var authResponse = await _provider.InitiateAuthAsync(request);
                return authResponse?.AuthenticationResult?.AccessToken;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Refresh token failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ForgotPasswordAsync(string userName)
        {
            var secretHash = CalculateSecretHash(userName, _clientId, _clientSecret);
            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                ClientId = _clientId,
                Username = userName,
                SecretHash = secretHash
            };

            try
            {
                await _provider.ForgotPasswordAsync(forgotPasswordRequest);
                return "Password reset code sent";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Password reset failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ConfirmForgotPasswordAsync(string userName, string confirmationCode, string newPassword)
        {
            var secretHash = CalculateSecretHash(userName, _clientId, _clientSecret);
            var confirmForgotPasswordRequest = new ConfirmForgotPasswordRequest
            {
                ClientId = _clientId,
                Username = userName,
                ConfirmationCode = confirmationCode,
                Password = newPassword,
                SecretHash = secretHash
            };

            try
            {
                await _provider.ConfirmForgotPasswordAsync(confirmForgotPasswordRequest);
                return "Password reset successful";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Password reset confirmation failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ChangePasswordAsync(string accessToken, string oldPassword, string newPassword)
        {
            var changePasswordRequest = new ChangePasswordRequest
            {
                AccessToken = accessToken,
                PreviousPassword = oldPassword,
                ProposedPassword = newPassword
            };

            try
            {
                await _provider.ChangePasswordAsync(changePasswordRequest);
                return "Password changed successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Change password failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> UpdateUserAttributesAsync(string accessToken, string email = null, string phoneNumber = null)
        {
            var attributes = new List<AttributeType>();
            if (email != null)
                attributes.Add(new AttributeType { Name = "email", Value = email });
            if (phoneNumber != null)
                attributes.Add(new AttributeType { Name = "phone_number", Value = phoneNumber });

            var updateRequest = new UpdateUserAttributesRequest
            {
                AccessToken = accessToken,
                UserAttributes = attributes
            };

            try
            {
                await _provider.UpdateUserAttributesAsync(updateRequest);
                return "User attributes updated successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Update user attributes failed: " + ex.Message);
                return null;
            }
        }

        public async Task<string> DeleteAccountAsync(string accessToken)
        {
            var deleteRequest = new DeleteUserRequest
            {
                AccessToken = accessToken
            };

            try
            {
                await _provider.DeleteUserAsync(deleteRequest);
                return "Account deleted successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Delete account failed: " + ex.Message);
                return null;
            }
        }

        private static string CalculateSecretHash(string username, string clientId, string clientSecret)
        {
            // Create the string to hash: the username (or email) + clientId
            var message = username + clientId;

            // Compute the HMACSHA256 hash of the message using the client secret
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(clientSecret)))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}