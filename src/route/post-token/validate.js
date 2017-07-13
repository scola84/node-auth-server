import { tokenValidator } from '@scola/auth-common';

export default function validate() {
  return (request, callback) => {
    tokenValidator.validate(request.data(), callback);
  };
}
