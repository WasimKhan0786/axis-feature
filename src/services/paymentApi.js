import { generateHash }
from "../Hash/generateHash";

export const initiatePayment =
async (formData) => {

  const hash = generateHash(
    formData.email,
    formData.cardNumber
  );
console.log("Hash:", hash);
const payload = {
  orderId: "ORD" + Date.now(),
  cardHolderName: formData.cardHolder,
  email: formData.email,
  cardNumber: formData.cardNumber.replace(/\s/g, ""),
  expiryMonth: formData.expiryMonth,
expiryYear: "20" + formData.expiryYear,
  cardCVC: formData.cvv,
  amount: Number(formData.amount), 
  currency: formData.currency,
  country: formData.country,
  phone: formData.phone,
  address: formData.address
};
  console.log("PAYLOAD:", payload);

  const response = await fetch(
    `${import.meta.env.VITE_PAYMENT_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Hash": hash 
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();
  if (data.redirect_url) {
    window.location.href = data.redirect_url;
  } else {
  console.log("No redirect URL found", data);
}

  return data;

};