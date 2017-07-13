import verifyToken from '../../helper/verify-token';

export default function post(server) {
  return (request, callback) => {
    verifyToken(server.auth(), request.data(), request, callback);
  };
}
