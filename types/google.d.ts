declare global {
  interface Window {
    google: typeof google;
    googleAuthClient: any;
  }
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface CodeClient {
        requestCode(): void;
      }

      interface CodeClientConfig {
        client_id: string;
        scope: string;
        ux_mode: "popup" | "redirect";
        redirect_uri?: string;
        callback: (response: any) => void;
      }

      function initCodeClient(config: CodeClientConfig): CodeClient;
    }
  }
}

export {};
