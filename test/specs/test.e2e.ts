import { browser } from '@wdio/globals'
import { Key } from 'webdriverio';

// Template

describe('Test section title', () => {
    it('Individual test description 1', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        // Enter test here
    });
    it('Individual test description 2', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        // Enter test here
    });
});

// Text area basic functionality

describe("Arrowkeys work", () => {
    it("Tests that navigation by arrowkeys is working in text area", async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        
        await browser.$("#textarea").click();
        await browser.keys(['a', 'b']);
        await expect(await textArea.getText()).toEqual("ab");
        
        await browser.keys([Key.ArrowLeft, 'c']);
        await expect(await textArea.getText()).toEqual("acb");

        await browser.keys([Key.ArrowRight, Key.ArrowRight, 'd']);
        await expect(await textArea.getText()).toEqual("acbd")
        
        console.log("HTML SER UT SÅHÄR: \n" + await textArea.getText() + "\n SLUT");
    });
  });


// Math field

describe('Basic math field functionality', () => {
    it('Can create and edit mathfield', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");

        await browser.$("#textarea").click();
        await browser.$("#button-MQ").click();
        await expect(await textArea.getText()).toEqual("  ");

        await browser.keys('a');
        await expect(await textArea.getText()).toEqual(" a ");
    });
    it('Can handle MQ-commands', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");

        await browser.$("#textarea").click();
        await browser.$("#button-MQ").click();

        await browser.keys('int');
        await expect(await textArea.getText()).toEqual(" ∫\n ");
    });
});

describe("MQ field navigation right/left", () => {
    it("Tests navigation with right/left ArrowKeys through a mathfield", async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();

        await browser.keys('aaaa');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft]);

        await browser.$("#button-MQ").click();
        await browser.keys(["int", "a", Key.ArrowUp, "b", Key.ArrowRight, "c"]);
        await expect(await textArea.getText()).toEqual("aa \n∫\nb\na\nc aa");
        
        await browser.$("#textarea").click();
        
        await browser.keys([Key.ArrowLeft, "k", Key.ArrowLeft, Key.ArrowLeft, "l", Key.ArrowLeft, Key.ArrowLeft, "m", Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, "h"]);
        await expect(await textArea.getText()).toEqual("aah \n∫\nb\na\ncm laka");

        await browser.keys([Key.ArrowLeft, "n", Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, "o", Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, "p"]);
        await expect(await textArea.getText()).toEqual("aanh \n∫\nbo\na\ncm lapka");

        console.log("HTML SER UT SÅHÄR: \n" + await textArea.getText() + "\n SLUT");
    });
    it('Can exit to empty right', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");

        await browser.$("#textarea").click();
        await browser.keys('a');
        await browser.$("#button-MQ").click();

        await browser.keys(['b', Key.ArrowRight, 'c']);
        await expect(await textArea.getText()).toEqual("a \nb c");
    });
  });


  