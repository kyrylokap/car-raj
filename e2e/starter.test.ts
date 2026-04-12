import { device, element, by, expect, waitFor } from "detox";

describe("App Launch", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: "YES" },
    });
  });

  it("should handle login if needed and land on Search", async () => {
    // If we land on Auth screen, tap guest login
    try {
      await waitFor(element(by.id("guest-login-button")))
        .toBeVisible()
        .withTimeout(5000);
    } catch (e) {
      // Maybe need to scroll
      try {
        await element(by.id("auth-scroll-view")).scroll(300, "down");
      } catch (err) {}
    }

    try {
      await element(by.id("guest-login-button")).tap();
    } catch (e) {
      // Not on auth screen or button not found, continue
    }

    // Wait for car list instead of just text
    await waitFor(element(by.id("search-car-list")))
      .toBeVisible()
      .withTimeout(20000);
  });

  it("should display the filter button on search screen", async () => {
    await expect(element(by.id("filter-button"))).toBeVisible();
  });
});

describe("Tab Navigation", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: false,
      permissions: { notifications: "YES" },
    });
  });

  it("should navigate to Chats tab", async () => {
    await element(by.id("tab-chats-label")).tap();
    await waitFor(element(by.id("chats-screen")))
      .toBeVisible()
      .withTimeout(8000);
  });

  it("should navigate to Profile tab", async () => {
    await element(by.id("tab-profile-label")).tap();
    await waitFor(element(by.id("profile-screen")))
      .toBeVisible()
      .withTimeout(8000);
  });

  it("should navigate back to Search tab", async () => {
    await element(by.id("tab-search-label")).tap();
    await waitFor(element(by.id("search-car-list")))
      .toBeVisible()
      .withTimeout(8000);
  });
});

describe("Search & Filters Flow", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: false,
      permissions: { notifications: "YES" },
    });
    await element(by.id("tab-search-label")).tap();
  });

  it("should open filters bottom sheet", async () => {
    await element(by.id("filter-button")).tap();
    await waitFor(element(by.text("Filters")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should display Show Results and Reset buttons", async () => {
    await expect(element(by.text("Show Results"))).toBeVisible();
    await expect(element(by.text("Reset"))).toBeVisible();
  });

  it("should reset filters and close sheet", async () => {
    await element(by.text("Reset")).tap();
    await element(by.text("Show Results")).tap();
    await waitFor(element(by.id("filter-button")))
      .toBeVisible()
      .withTimeout(5000);
  });
});

describe("Car Detail Flow", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: false,
      permissions: { notifications: "YES" },
    });
    await element(by.id("tab-search-label")).tap();
  });

  it("should navigate to car details", async () => {
    await waitFor(element(by.id("car-item-0")))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id("car-item-0")).tap();
    await waitFor(element(by.text("Specifications")))
      .toBeVisible()
      .withTimeout(10000);
  });

  it("should navigate back to search", async () => {
    await element(by.id("car-detail-back-button")).tap();
    await waitFor(element(by.id("search-car-list")))
      .toBeVisible()
      .withTimeout(5000);
  });
});

describe("Profile Screen Sheets", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: false,
      permissions: { notifications: "YES" },
    });
    await element(by.id("tab-profile-label")).tap();
  });

  it("should open My Vehicles sheet", async () => {
    await element(by.text("My vehicles")).tap();
    await waitFor(element(by.text("My cars")))
      .toBeVisible()
      .withTimeout(5000);
    // Refresh list to trigger logic
    await element(by.text("My cars")).swipe("down", "slow", 0.3);
  });

  it("should open Sell Vehicle sheet", async () => {
    await element(by.text("Sell vehicle")).tap();
    await waitFor(element(by.text("Sell your car")))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.text("Cancel")).tap();
  });
});

describe("Settings Flow", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: false,
      permissions: { notifications: "YES" },
    });
    await element(by.id("tab-profile-label")).tap();
  });

  it("should navigate to Settings and back", async () => {
    await element(by.text("Settings")).tap();
    await waitFor(element(by.text("Dark Mode")))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id("settings-back-button")).tap();
    await waitFor(element(by.id("profile-screen")))
      .toBeVisible()
      .withTimeout(5000);
  });
});
