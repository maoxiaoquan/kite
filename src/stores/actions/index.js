import fetchPost from '../../../../common/api';

export function getH5SaleList(data, func) {
  if (data == undefined) return false;
  var action = data.page ? 'H5SALE_LIST_ADD' : 'H5SALE_LIST'
  return (dispatch) => {
    fetchPost({
      os: "Wap",
      code: "Special/Active/salePromotion",
      params: JSON.stringify(data)
    }, function (res) {
      if (func)
        func(res)
      return dispatch({ type: action, data: res.response.data });
    }, action + new Date().getTime())
  }
}
