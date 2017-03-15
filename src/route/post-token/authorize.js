import verifyToken from '../../helper/verify-token';

export default function authorize(server) {
  return (request, response, next) => {
    verifyToken(server.auth(), request.data(), request, next);
  };
}
