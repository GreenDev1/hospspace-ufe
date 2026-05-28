import { Component, State, Prop, Host, h } from '@stencil/core';

declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'ln-hospspace-app',
  styleUrl: 'ln-hospspace-app.css',
  shadow: true,
})
export class LnHospspaceApp {

  @State() private relativePath = "";

  @Prop() basePath: string = "/hospital-spaces/";

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || "/").pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = "";
      }
    };

    window.navigation?.addEventListener("navigate", (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }

      const path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  }

  private navigate(path: string) {
    const absolute = new URL(
      path,
      new URL(this.basePath, document.baseURI)
    ).pathname;

    window.navigation?.navigate(absolute);
  }

  render() {

    let element: 'evidencia' | 'priradenie' | 'prehlad' = 'evidencia';

    if (this.relativePath.startsWith("priradenie")) {
      element = "priradenie";
    } else if (this.relativePath.startsWith("prehlad")) {
      element = "prehlad";
    }

    return (
      <Host>
        
        <header style={{
          background: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ padding: "16px 0" }}>
            <h1 style={{
              margin: '0',
              fontSize: "20px",
              color: "var(--md-sys-color-primary, #1a73e8)"
            }}>
              Hospital Spaces - Správa priestorov
            </h1>
          </div>

          <md-tabs>

            <md-primary-tab
              active={element === 'evidencia'}
              onClick={() => this.navigate("./evidencia")}
            >
              Evidencia
            </md-primary-tab>

            <md-primary-tab
              active={element === 'priradenie'}
              onClick={() => this.navigate("./priradenie")}
            >
              Priradenie
            </md-primary-tab>

            <md-primary-tab
              active={element === 'prehlad'}
              onClick={() => this.navigate("./prehlad")}
            >
              Prehľad
            </md-primary-tab>

          </md-tabs>
        </header>

        <main style={{ padding: "24px" }}>

          {element === "evidencia"
            ? <ln-hospspace-wl-list role="spravca" />
            : element === "priradenie"
              ? <ln-hospspace-wl-list role="veduci" />
              : <ln-hospspace-wl-list role="general" />
          }

        </main>

      </Host>
    );
  }
}