export const validateRazorpayAvailability = () => {
  if (!window.Razorpay) {
    throw new Error("Razorpay failed to load. Please try again.");
  }
};

export const formatPaymentError = (error) => {
  return error?.data?.message || "Unable to process payment. Please try again.";
};

export const createPassengerDetails = (formData) => ({
  name: `${formData.firstName} ${formData.lastName}`,
  age: formData.age,
  gender: formData.gender,
  email: formData.email,
  phone: formData.phone,
});

export const createPrefillData = (formData) => ({
  name: `${formData.firstName} ${formData.lastName}`,
  email: formData.email,
  contact: formData.phone,
});

