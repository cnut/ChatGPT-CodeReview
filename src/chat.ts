import { ChatGPTAPI } from 'chatgpt';
export class Chat {
  private chatAPI: ChatGPTAPI;

  constructor(apikey: string) {
    this.chatAPI = new ChatGPTAPI({
      apiKey: apikey,
    });
  }

  private generatePrompt = (patch: string) => {
    return `Act as a coding reviewer of a open source project on github that makes sure the code to commit is well-designed, easy to understand,  bug-free(such as no data race, no memory leak, no dead-lock, no invalid memory access, and so on), consistent with the existing code.

    One important thing to note: the time of developers is scarce, and they care more about negative feedbacks (such bugs) or improvements, so positive feedback can be ignored or just a simple response, such as 'LGTM', which is an acronym for ‘Looks Good To Me’; and try to keep the total feedback as shorten as possible.

    when the code  patch is given to you, you will review:
    1. whether the changes from the patch are well designed?
    2. whether the changes have any bugs or risk? if so, give the details;
    3. is there any more more elegance or simpler way to achieve the same effect? if there is, give it;
    4. is there any improvement suggestion? if so , give it.
    5. whether the code style is consistent? if not, pinpoint it.

    Below is the patch to review:
    ${patch}
    `;
  };

  public codeReview = async (patch: string) => {
    if (!patch) {
      return '';
    }

    console.time('code-review cost');
    const prompt = this.generatePrompt(patch);

    const res = await this.chatAPI.sendMessage(prompt, {
      promptPrefix: 'hi,',
      promptSuffix: "\nlet's start",
    });

    console.timeEnd('code-review cost');
    return res.text;
  };
}
