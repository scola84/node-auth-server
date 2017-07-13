import { setValidator } from '@scola/auth-common';

export default function validate() {
  return (request, callback) => {
    setValidator.validate(request.data(), callback);
  };
}
