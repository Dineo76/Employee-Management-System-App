export const actionTypes = {
    SET_PRODUCTS: "SET_PRODUCTS",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
  };

// Action creators
export const setProducts = (products) => ({
  type: actionTypes.SET_PRODUCTS,
  payload: products,
});

export const addToCart = (product) => ({
  type: actionTypes.ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (id) => ({
  type: actionTypes.REMOVE_FROM_CART,
  payload: id,
});

export const login = (user) => ({
  type: actionTypes.LOGIN,
  payload: user,
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});