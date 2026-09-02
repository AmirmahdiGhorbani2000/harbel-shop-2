const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^09\d{9}$/;
  return re.test(phone);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validatePrice = (price) => {
  return typeof price === 'number' && price >= 0;
};

const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePrice,
  validateQuantity
};
