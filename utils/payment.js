export const validateRazorpayAvailability = () => {
  if (!window.Razorpay) {
    throw new Error("Razorpay failed to load. Please try again.");
  }
};

export const formatPaymentError = (error) => {
  return error?.data?.message || "Unable to process payment. Please try again.";
};

export const createPassengerDetails = (formData) => ({
    name:
    formData?.name ||
    [formData?.firstName, formData?.lastName]
      .filter(Boolean)
      .join(" "),

  email: data?.email || "",
  age: formData.age,
  gender: formData.gender,
  email: formData.email,
  phone: formData.phone,
});

export const createPrefillData = (data) => ({
  name:
    data?.name ||
    [data?.firstName, data?.lastName]
      .filter(Boolean)
      .join(" "),

  email: data?.email || "",

  contact: data?.phone || data?.phoneNumber || "",
});