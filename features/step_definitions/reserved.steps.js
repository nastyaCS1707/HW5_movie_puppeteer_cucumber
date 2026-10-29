const puppeteer = require("puppeteer");
const { setDefaultTimeout } = require("@cucumber/cucumber");
setDefaultTimeout(120000);
const assert = require("node:assert/strict");
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const {
  xp,
  clickElement,
  getText,
  getPrice,
  openHall,
} = require("../../lib/commands");

const buttonByText = (text) =>
  xp(
    `//button[contains(@class,'acceptin-button') and contains(normalize-space(.), '${text}')]`,
  );

const RESERVE_BUTTON = buttonByText("Забронировать");
const GET_CODE_BUTTON = buttonByText("Получить код");
const MOVIE_SEANCE_TIME = (movie, time) =>
  xp(
    `(//section[@class='movie'])[${movie}]//a[contains(@class, 'movie-seances__time') and contains(text(), '${time}')]`,
  );
const CHOICE_SEAT = (row, place) =>
  xp(
    `(//div[contains(@class,'buying-scheme__row')])[${row}]` +
      `/span[contains(@class,'buying-scheme__chair')][${place}]`,
  );

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});
Given("user is on {string} page", async function (url) {
  return await this.page.goto(url, {
    setTimeout: 20000,
  });
});

When("user choose day of week by {int}", async function (last_time) {
  await openHall(last_time);
});

When(
  "user choose film by {int} and {string}",
  async function (film_id, seance_time) {
    await clickElement(this.page, MOVIE_SEANCE_TIME(film_id, seance_time));
  },
);

When("user choose row {int} seat {int}", async function (row, seat) {
  await clickElement(this.page, CHOICE_SEAT(row, seat));
});

When("user click button for reserved", async function () {
  await clickElement(this.page, RESERVE_BUTTON);
});

When("user click button for get code", async function () {
  await clickElement(this.page, GET_CODE_BUTTON);
});

Then("user sees the {int} price of ticket", async function (expected) {
  assert.equal(await getPrice(this.page), expected);
});

Then("user sess button {string}", async function (string) {
  const text = await getText(this.page, GET_CODE_BUTTON);
  assert.ok(text.includes(string));
});

Then("user sess that button is disabled", async function () {
  const isDisabled = () =>
    this.page.$eval(RESERVE_BUTTON, (button) =>
      button.hasAttribute("disabled"),
    );

  assert.equal(await isDisabled(), true);
});
