// Flow route. Serves the question definitions to the (separately-deployed)
// frontend so it can render the chat and resolve branches locally.
//
// Returns the raw flow including branch.followUps maps — the frontend has
const express = require("express");
const router = express.Router();

// ---- GET /api/flow/:type  (founder | investor) ----
router.get("/:type", (req, res) => {
  const { type } = req.params;
  try {
    const { getFlow } = require("../flow/flow");
    const flow = getFlow(type);
    return res.json({ flow });
  } catch (e) {
    return res.status(404).json({ error: `unknown flow type: ${type}` });
  }
});

module.exports = router;