import { actionTypes } from "./action";

export const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  products: [],
  cart: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
    
      case actionTypes.ADD_TO_CART:
      return {
        ...state,
        cart: (() => {
          const existing = state.cart.find((item) => item.id === action.payload.id);
          if (existing) {
            return state.cart.map((item) =>
              item.id === action.payload.id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            );
          }
          return [...state.cart, { ...action.payload, quantity: 1 }];
        })(),
      };
    
      case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: (() => {
          const existing = state.cart.find((item) => item.id === action.payload);
          if (!existing) return state.cart;
          const qty = existing.quantity || 1;
          if (qty > 1) {
            return state.cart.map((item) =>
              item.id === action.payload
                ? { ...item, quantity: qty - 1 }
                : item
            );
          }
          return state.cart.filter((item) => item.id !== action.payload);
        })(),
      };
   
      case actionTypes.LOGIN:
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    
      case actionTypes.LOGOUT:
      localStorage.removeItem("user");
      return { ...state, user: null };
    default:
      return state;
  }
};
