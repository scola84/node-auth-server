import { setValidator } from '@scola/auth-common';

export default function validate() {
  return (request, response, next) => {
    setValidator.validate(request.data(), next);
  };
}
