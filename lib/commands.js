"use strict";
const xp = (expr) => `::-p-xpath(${String(expr).trim()})`;

function assertSelector(selector, fnName) {
  if (typeof selector !== "string" || selector.trim() === "") {
    throw new Error(`${fnName}: селектор должен быть непустой строкой`);
  }
}

async function clickElement(page, selector, { timeout = 15000 } = {}) {
  assertSelector(selector, "clickElement");
  try {
    await page.locator(selector).setTimeout(timeout).click();
  } catch (error) {
    throw new Error(`clickElement: не удалось кликнуть по "${selector}"`, {
      cause: error,
    });
  }
}

async function getPrice(page, { timeout = 15000 } = {}) {
  const raw = await getText(
    page,
    xp("//span[contains(@class,'ticket__cost')]"),
    {
      timeout,
    },
  );
  const price = Number(raw.replace(/[^\d]/g, ""));
  return price;
}

async function getText(page, selector, { timeout = 15000 } = {}) {
  assertSelector(selector, "getText");
  const handle = await page.waitForSelector(selector, { timeout });
  try {
    return (await handle.evaluate((el) => el.textContent ?? "")).trim();
  } finally {
    await handle.dispose().catch(() => {});
  }
}
async function openHall(hourLimit = {}) {
  const currentHour = new Date().getHours();
  if (currentHour > hourLimit) {
    const weekdays = await page.$$(".page-nav__day");
    await weekdays[1].click();
  }
}

module.exports = { xp, clickElement, getText, getPrice, openHall };
