exports.version = async (req, res) => {
  const version = process.env.CURRENT_VERSION;
  try {
    await res.json({ message: { version_number: version }, status: 200 });
  } catch (err) {
    await res.json({ message: { "error from catch": err }, status: 500 });
  }
};
