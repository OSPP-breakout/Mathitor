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

describe("Basic functionality", () => {
    it("Navigation by left/right arrowkeys is working in text area", async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        
        await browser.$("#textarea").click();
        await browser.keys('ab');
        await expect(await textArea.getText()).toEqual("ab");
        
        await browser.keys([Key.ArrowLeft, 'c']);
        await expect(await textArea.getText()).toEqual("acb");

        await browser.keys([Key.ArrowRight, Key.ArrowRight, 'd']);
        await expect(await textArea.getText()).toEqual("acbd")
        
        // console.log("HTML SER UT SÅHÄR: \n" + await textArea.getText() + "\n SLUT");
    });
    it('Undo/redo buttons', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('ab');
        await expect(await textArea.getText()).toEqual("ab");

        await browser.$("#btn-undo").click();
        await expect(await textArea.getText()).toEqual("");

        await browser.$("#btn-redo").click();
        await expect(await textArea.getText()).toEqual("ab");
    });
    it('Bold button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift]);
        await browser.$("#btn-bold").click();
        await expect(await textArea.getHTML(false)).toEqual("Ett <b>två</b> tre");        
    });
    it('Italic button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift]);
        await browser.$("#btn-italic").click();
        await expect(await textArea.getHTML(false)).toEqual("Ett <i>två</i> tre");
        // console.log("HTML SER UT SÅHÄR: \n" + await $("#textarea").getHTML(false) + "\n SLUT");
    });
    it('Underline button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift]);
        await browser.$("#btn-underline").click();
        await expect(await textArea.getHTML(false)).toEqual("Ett <u>två</u> tre");        
    });
    it('Strikethrough button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Shift]);
        await browser.$("#btn-slash").click();
        await expect(await textArea.getHTML(false)).toEqual("Ett <strike>två</strike> tre");        
    }); 
    it('Align left button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.$("#textarea").click();
        await browser.$("#btn-align-r").click();
        await expect(await textArea.getHTML(false) as string).toEqual("<div style=\"text-align: right;\">Ett två tre</div>");

        await browser.$("#btn-align-l").click();
        await expect(await textArea.getHTML(false) as string).toEqual("<div style=\"text-align: left;\">Ett två tre</div>");
    });
    it('Align center button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.$("#textarea").click();
        await browser.$("#btn-align-c").click();
        await expect(await textArea.getHTML(false) as string).toEqual("<div style=\"text-align: center;\">Ett två tre</div>"); 
    });
    it('Align right button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.$("#textarea").click();
        await browser.$("#btn-align-r").click();
        // console.log("HTML SER UT SÅHÄR: \n" + (await textArea.getHTML(false)) + "\n SLUT");   
        await expect(await textArea.getHTML(false) as string).toEqual("<div style=\"text-align: right;\">Ett två tre</div>"); 
    });
    // it('Justify full button', async () => {
    //     await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
    //     await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
    //     await expect("Not impemented").toEqual(false); 
    // });
    it('Ordered list button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.$("#textarea").click();
        await browser.$("#btn-ordered-list").click();
        await expect(await textArea.getHTML(false) as string).toEqual("<ol><li>Ett två tre</li></ol>"); 
    });
    it('Unordered list button', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Ett två tre');
        await browser.$("#textarea").click();
        await browser.$("#btn-unordered-list").click();
        await expect(await textArea.getHTML(false) as string).toEqual("<ul><li>Ett två tre</li></ul>"); 
    });
    // it('Add link button', async () => {
    //     await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
    //     await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
    //     await expect("Not impemented").toEqual(false); 
    // });
    // it('Unlink button', async () => {
    //     await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
    //     await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
    //     await expect("Not impemented").toEqual(false); 
    // });
    it('Nested formatting', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");
        await browser.$("#textarea").click();
        await browser.keys('Lorem ipsum dolor sit amet.');
        await browser.keys([Key.Home, Key.Shift, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.Shift]);
        await browser.$("#btn-bold").click();
        await browser.$("#btn-italic").click();
        await browser.$("#btn-underline").click();
        await expect(await textArea.getHTML(false)).toEqual("<b><i><u>Lorem</u></i></b> ipsum dolor sit amet.");        
    });
  });


// Math field

describe('Basic math field functionality', () => {
    it('Create and edit mathfield', async () => {
        await browser.url("file:///C:/Users/linus/Mathitor/dist/index.html");
        await expect(browser).toHaveUrl("file:///C:/Users/linus/Mathitor/dist/index.html");
        const textArea = await $("#textarea");

        await browser.$("#textarea").click();
        await browser.$("#button-MQ").click();
        await expect(await textArea.getText()).toEqual("  ");

        await browser.keys('a');
        await expect(await textArea.getText()).toEqual(" a ");
    });
    it('Handle MQ-commands', async () => {
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
    it("Navigation with right/left ArrowKeys through a mathfield", async () => {
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

        // console.log("HTML SER UT SÅHÄR: \n" + await textArea.getText() + "\n SLUT");
    });
    it('Exit mathfield to empty right', async () => {
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


  