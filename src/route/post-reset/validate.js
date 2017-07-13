import { resetValidator } from '@scola/auth-common';

export default function validate() {
  return (request, callback) => {
    resetValidator.validate(request.data(), callback);
  };
}
