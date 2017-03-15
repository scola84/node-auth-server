import { tokenValidator } from '@scola/auth-common';

export default function validate() {
  return (request, response, next) => {
    tokenValidator.validate(request.data(), next);
  };
}
