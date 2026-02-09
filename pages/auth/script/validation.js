const validateLoginForm = (formData) => {
  if (!formData.email || !formData.password) {
    throw new Error("Please fill in all fields");
  }
};

const validateSignupForm = (formData) => {
  if (!formData.name || !formData.email || !formData.password) {
    throw new Error("Please fill in all fields");
  }
  if (formData.password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (formData.password !== formData.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (!formData.termsAndConditions) {
    throw new Error("Please accept terms and conditions");
  }
};

export { validateLoginForm, validateSignupForm };
