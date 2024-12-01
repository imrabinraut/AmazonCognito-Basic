using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly CognitoAuthService _authService;

        public AuthController(CognitoAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            var response = await _authService.SignUpAsync(request.Username, request.Password, request.Email);
            if (response == null)
                return BadRequest("Sign-up failed");
            return Ok(new { status = 200, UserSub = response });
        }

        [HttpPost("resend-confirmation")]
        public async Task<IActionResult> ResendConfirmation([FromBody] ResendConfirmationRequest request)
        {
            var result = await _authService.ResendConfirmationCodeAsync(request.Username);
            if (result == null)
                return BadRequest("Failed to resend confirmation code");
            return Ok(new { status = 200, message = result });
        }

        [HttpPost("confirm-sign-up")]
        public async Task<IActionResult> ConfirmSignUp([FromBody] ConfirmSignUpRequest request)
        {
            var response = await _authService.ConfirmSignUpAsync(request.Username, request.ConfirmationCode);
            if (response == null)
                return BadRequest("Confirmation failed");
            return Ok(new { status = 200, message = response });
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            var response = await _authService.SignInAsync(request.Username, request.Password);
            if (response == null || response.Item1 == null || response.Item2 == null)
                return BadRequest("Sign-in failed");
            return Ok(new { status = 200, AccessToken = response.Item1, RefreshToken = response.Item2 });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var token = await _authService.RefreshTokenAsync(request.Username, request.RefreshToken);
            if (token == null)
                return Unauthorized("Failed to refresh token");
            return Ok(new { status = 200, AccessToken = token });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var response = await _authService.ForgotPasswordAsync(request.Username);
            if (response == null)
                return BadRequest("Failed to initiate password reset");
            return Ok(new { status = 200, message = response });
        }

        [HttpPost("confirm-forgot-password")]
        public async Task<IActionResult> ConfirmForgotPassword([FromBody] ConfirmForgotPasswordRequest request)
        {
            var response = await _authService.ConfirmForgotPasswordAsync(request.Username, request.ConfirmationCode, request.NewPassword);
            if (response == null)
                return BadRequest("Password reset confirmation failed");
            return Ok(new { status = 200, message = response });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var result = await _authService.ChangePasswordAsync(request.AccessToken, request.OldPassword, request.NewPassword);
            if (result == null)
                return BadRequest("Password change failed");
            return Ok(new { status = 200, message = result });
        }

        [HttpPost("update-user-attributes")]
        public async Task<IActionResult> UpdateUserAttributes([FromBody] UpdateAttributesRequest request)
        {
            var result = await _authService.UpdateUserAttributesAsync(request.AccessToken, request.Email, request.PhoneNumber);
            if (result == null)
                return BadRequest("Failed to update user attributes");
            return Ok(new { status = 200, message = result });
        }

        [HttpPost("delete-account")]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest request)
        {
            var result = await _authService.DeleteAccountAsync(request.AccessToken);
            if (result == null)
                return BadRequest("Account deletion failed");
            return Ok(new { status = 200, message = result });
        }

        [HttpPost("sign-out")]
        public async Task<IActionResult> SignOut([FromBody] SignOutRequest request)
        {
            try
            {
                await _authService.LogoutAsync(request.AccessToken);
                return Ok(new { status = 200, message = "User logged out successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Logout failed: {ex.Message}");
            }
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard(string accessToken)
        {
            bool isValid = false;
            try
            {
                isValid = await _authService.ValidateTokenAsync(accessToken);
                if (isValid)
                {
                    return Ok(new { status = 200, message = "Welcome" });
                }
                return BadRequest($"Failed");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed: {ex.Message}");
            }
        }
    }

    public class SignUpRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
    }

    public class ConfirmSignUpRequest
    {
        public string? Username { get; set; }
        public string? ConfirmationCode { get; set; }
    }

    public class SignInRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    public class ForgotPasswordRequest
    {
        public string? Username { get; set; }
    }

    public class ConfirmForgotPasswordRequest
    {
        public string? Username { get; set; }
        public string? ConfirmationCode { get; set; }
        public string? NewPassword { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string? Username { get; set; }
        public string? RefreshToken { get; set; }
    }

    public class ResendConfirmationRequest
    {
        public string? Username { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string? AccessToken { get; set; }
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    public class UpdateAttributesRequest
    {
        public string? AccessToken { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class DeleteAccountRequest
    {
        public string? AccessToken { get; set; }
    }

    public class SignOutRequest
    {
        public string? AccessToken { get; set; }
    }
}