module.exports = {
  launch: {
    // v22+: true = новый headless, "shell" = старый chrome-headless-shell
    slowMo: 300,
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  },
  browserContext: "default",
  // любой pageerror на чужом сайте не должен убивать воркер
  exitOnPageError: false,
};
