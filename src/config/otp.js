const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 5,
  maxAttempts: 5,
  purposes: {
    REQUIREMENT: 'requirement',
    BOOKING: 'booking',
    GET_IN_TOUCH: 'get_in_touch'
  }
};

module.exports = OTP_CONFIG;
