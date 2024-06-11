const createStore = (reducer, initialState) => {
  let state = initialState;
  let listeners = [];
  for (let i = 0; i < listeners.length; i++) {
    listeners[i]();
  }
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  return { getState, dispatch, subscribe };
};

const appState = {
  user: {
    name: "John Doe",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  },

  foodItems: [
    {
      id: 1,
      name: "Pizza",
      image: "http://picsum.photos/200/300",
      price: 10,
    },
    {
      id: 2,
      name: "Burger",
      image: "http://picsum.photos/200/300",
      price: 5,
    },
    {
      id: 3,
      name: "Sandwich",
      image: "http://picsum.photos/200/300",
      price: 7,
    },
    {
      id: 4,
      name: "Pasta",
      image: "http://picsum.photos/200/300",
      price: 8,
    },
    {
      id: 5,
      name: "Salad",
      image: "http://picsum.photos/200/300",
      price: 6,
    },
  ],
  cart: {
    items: [],
    total: 0,
  },
  favorites: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((f) => f.id !== action.payload.id),
      };

    case "ADD_TO_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
          total: state.cart.total + action.payload.price,
        },
      };

    case "REMOVE_CART":
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            (item) => item.id !== action.payload.id
          ),
          total: state.cart.total - action.payload.price,
        },
      };
    default:
      return state;
  }
};

const addToCart = (payload) => {
  return {
    type: "ADD_TO_CART",
    payload,
  };
};

const removeFromCart = (payload) => {
  return {
    type: "REMOVE_FROM_CART",
    payload,
  };
};
const addFavorite = (payload) => {
  return {
    type: "ADD_FAVORITE",
    payload,
  };
};
const removeFavorite = (payload) => {
  return {
    type: "REMOVE_FAVORITE",
    payload,
  };
};

const store = createStore(appReducer, appState);

const isFavorite = (foodItem) => {
  return store.getState().favorites.some((f) => f.id === foodItem.id);
};

const isAddedToCart = (foodItem) => {
  return store.getState().cart.items.some((f) => f.id === foodItem.id);
};

window.onload = () => {
  store.subscribe(() => {
    console.log(store.getState());
  });

  const addToCartButtons = document.getElementsByClassName("add_to_cart_button");
  const addFavoriteButtons = document.getElementsByClassName(
    "add_favorite_button"
  );

  for (let i = store.getState().foodItems.length - 1; i >= 0; i--) {
    addToCartButtons[i].addEventListener("click", (evt) => {
      const foodItem = store.getState().foodItems[i];
      if (isAddedToCart(foodItem)) {
        store.dispatch(removeFromCart(foodItem));
        evt.target.innerText = "Add to Cart";

      } else {
        store.dispatch(addToCart(foodItem));
        evt.target.innerText = "Remove from Cart";

      }
    });
    
    addFavoriteButtons[i].addEventListener("click", () => {
      const foodItem = store.getState().foodItems[i];
      if (isFavorite(foodItem)) {
        store.dispatch(removeFavorite(foodItem));
      } else {
        store.dispatch(addFavorite(foodItem));
      }
    });
    
  }
  
};
