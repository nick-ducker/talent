export const defaultStateShape = {
  companies: null,
  currentCompany: null,
  loaded: false
}

export const companyReducer = (state, action) => {
  switch (action.type) {
    case "setCompanies":
      return {
        ...state,
        companies: action.payload,
        loaded: true
      };
    case "clearCompanies":
      return {
        ...state, 
        companies: {}, 
        loaded: false
      }
    case "updateCompanies":
      return {
        ...state,
        companies: action.payload
      }
    case "setCurrentCompany":
      return {
        ...state,
        currentCompany: action.payload
      }
      case "clearCurrentCompany":
      return {
        ...state,
        currentCompany: {}
      }
    default: 
      throw new Error("Unknown action in Company Reducer")
  }
}