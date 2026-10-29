const {
  xp,
  clickElement,
  getText,
  getPrice,
  openHall,
} = require("./lib/commands");

const BASE_URL = "http://qamid.tmweb.ru/";
const buttonByText = (text) =>
  xp(
    `//button[contains(@class,'acceptin-button') and contains(normalize-space(.), '${text}')]`,
  );

const RESERVE_BUTTON = buttonByText("Забронировать");
const GET_CODE_BUTTON = buttonByText("Получить код");
const WEEKDAYS = ".page-nav__day";
const MOVIE_SEANCE_TIME = (movie, time) =>
  xp(
    `(//section[@class='movie'])[${movie}]//a[contains(@class, 'movie-seances__time') and contains(text(), '${time}')]`,
  );
const CHOICE_SEAT = (row, place) =>
  xp(
    `(//div[contains(@class,'buying-scheme__row')])[${row}]` +
      `/span[contains(@class,'buying-scheme__chair')][${place}]`,
  );

describe("Reserved seating tests", () => {
  beforeEach(async () => {
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(120000);

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(WEEKDAYS);
  });

  test("Reserved standart seat", async () => {
    const standart_price = 100;
    const text_on_button = "Получить код бронирования";
    await openHall(13);
    await clickElement(page, MOVIE_SEANCE_TIME(1, "13:00"));
    await clickElement(page, CHOICE_SEAT(1, 1));
    await clickElement(page, RESERVE_BUTTON);

    const price = await getPrice(page);
    expect(price).toBe(standart_price);

    const text = await getText(page, GET_CODE_BUTTON);
    expect(text).toContain(text_on_button);
  });

  test("Reserved VIP seat", async () => {
    const vip_price = 650;
    const text_on_button = "Получить код бронирования";
    await openHall(20);
    await clickElement(page, MOVIE_SEANCE_TIME(2, "20:00"));
    await clickElement(page, CHOICE_SEAT(1, 11));
    await clickElement(page, RESERVE_BUTTON);

    const price = await getPrice(page);
    expect(price).toBe(vip_price);

    const text = await getText(page, GET_CODE_BUTTON);
    expect(text).toContain(text_on_button);
  });

  test("Cannot book the same seat twice", async () => {
    await openHall(13);
    await clickElement(page, MOVIE_SEANCE_TIME(1, "13:00"));
    await clickElement(page, CHOICE_SEAT(5, 6));
    await clickElement(page, RESERVE_BUTTON);
    await clickElement(page, GET_CODE_BUTTON);

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".page-nav__day");

    await openHall(13);
    await clickElement(page, MOVIE_SEANCE_TIME(1, "13:00"));
    await clickElement(page, CHOICE_SEAT(5, 6));
    const isDisabled = () =>
      page.$eval(RESERVE_BUTTON, (button) => button.hasAttribute("disabled"));
    expect(await isDisabled()).toBe(true);
  });
});
