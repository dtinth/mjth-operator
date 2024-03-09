import { renderToStaticMarkup } from "react-dom/server";
import { getServerInfo, rpc } from "./jamulus";

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
                <th>
                  Welcome to <a href="https://mjth.live">{props.serverName}</a>
                </th>
              </tr>
              {new Date().toISOString() < "2024-03-14T12:00:00.000Z" && (
                <tr>
                  <td
                    align="center"
                    style={{ backgroundColor: "#ffffff", color: "#0a5067" }}
                  >
                    [Event] เจอกับพวกเราได้ที่งาน “Music After Work Season 5 :
                    ปลาชุมดึก” วันพฤหัสบดีที่ 14 มีนาคม เวลา 19:00 ที่ Glowfish
                    Dining Hall —{" "}
                    <a href="https://www.instagram.com/p/C4KGT5AvCKq/?img_index=1">
                      อ่านรายละเอียด
                    </a>
                  </td>
                </tr>
              )}
              <tr>
                <td align="center" style={{ padding: "12px" }}>
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
                  <td align="center">
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

export async function syncWelcomeMessage(id: string) {
  const info = await getServerInfo(id);
  const result = await rpc(info, "jamulusserver/setWelcomeMessage", {
    welcomeMessage: generateWelcomeMessage(id, info),
  });
  return result;
}

export function generateWelcomeMessage(
  id: string,
  info: Awaited<ReturnType<typeof getServerInfo>>
) {
  function getDefaultServerName(id: string): string {
    return `MJTH [${id}]`;
  }

  return renderToStaticMarkup(
    <WelcomeMessage
      serverName={info.settings?.serverName || getDefaultServerName(id)}
      listenUrl={info.settings?.listenUrl}
    />
  );
}
