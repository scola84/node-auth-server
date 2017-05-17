export default function respond() {
  return (request, response) => {
    response
      .status(201)
      .end();
  };
}
