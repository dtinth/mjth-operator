export interface WelcomeMessage {
  serverName: string;
  listenUrl: string | undefined;
}

export function WelcomeMessage(props: WelcomeMessage) {
  return (
    <>
      <p />
      <table>
        <tr>
          <td>
            <table
              border={1}
              bgcolor="#FEF3C7"
              cellPadding={4}
              style={{ color: "#111111", borderColor: "#d3d4a2" }}
            >
              <tr>
                <th colSpan={3}>
                  Welcome to <a href="https://mjth.live">{props.serverName}</a>
                </th>
              </tr>
              <tr>
                <td colSpan={3} align="center" style={{ padding: "12px" }}>
                  <span style={{ fontSize: "20px" }}>
                    👉{" "}
                    <a href="https://discord.gg/f2pJfVWexa">
                      discord.gg/f2pJfVWexa
                    </a>{" "}
                    👈
                  </span>
                </td>
              </tr>
              {props.listenUrl ? (
                <tr>
                  <td colSpan={3} align="center">
                    listen &amp; recording service @{" "}
                    <a href={props.listenUrl}>lobby.mjth.live</a>
                  </td>
                </tr>
              ) : null}
            </table>
          </td>
          <td valign="bottom"></td>
        </tr>
      </table>
    </>
  );
}
