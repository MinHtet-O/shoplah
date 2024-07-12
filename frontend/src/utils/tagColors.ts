export const getItemConditionTagColor = (condition: string) => {
  switch (condition) {
    case "new":
      return "is-success";
    case "almost_new":
      return "is-info";
    case "lightly_used":
      return "is-warning";
    case "heavily_used":
      return "is-danger";
    case "refurbished":
      return "is-primary";
    default:
      return "";
  }
};

export const getPurchaseTypeTagColor = (type: string) => {
  switch (type) {
    case "direct_purchase":
      return "is-link";
    case "auction_purchase":
      return "is-info";
    default:
      return "";
  }
};
