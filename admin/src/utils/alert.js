import { message } from 'antd';

export default {

  message_success(data) { /*  */
    message.success(data);
  },

  message_error(data) {
    message.error(data);
  },

  message_warning(data) {
    message.warning(data);
  }
}