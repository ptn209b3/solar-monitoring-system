module.exports = (app) => {
  app.get("/record", (request, response) => {
    const { from, to } = request.query;
    console.log(from, to);
    return response.sendStatus(200);
  });
};
