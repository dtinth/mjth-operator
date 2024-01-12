import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { renderToStaticMarkup } from "react-dom/server";
import { ensureLoggedIn } from "~/utils/ensureLoggedIn";
import { getServerInfo, rpc } from "~/utils/jamulus";
import { WelcomeMessage } from "~/utils/welcomeMessage";

export async function loader(args: LoaderFunctionArgs) {
  await ensureLoggedIn(args);
  const id = args.params.id!;
  const info = await getServerInfo(id);
  const profile = await rpc(info, "jamulusserver/getServerProfile", {});
  const welcomeMessage = profile.welcomeMessage;
  const previewWelcomeMessage = generateWelcomeMessage(id, info);
  return {
    welcomeMessage,
    welcomeMessageSize: Buffer.byteLength(welcomeMessage, "utf-8"),
    previewWelcomeMessage,
    previewWelcomeMessageSize: Buffer.byteLength(
      previewWelcomeMessage,
      "utf-8"
    ),
  };
}

export async function action(args: ActionFunctionArgs) {
  await ensureLoggedIn(args);
  const id = args.params.id!;
  const info = await getServerInfo(id);
  const result = await rpc(info, "jamulusserver/setWelcomeMessage", {
    welcomeMessage: generateWelcomeMessage(id, info),
  });
  console.log(result);
  return null;
}

function generateWelcomeMessage(
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

export default function ServerWelcomeMessage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Current</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <iframe
                srcDoc={data.welcomeMessage}
                title="Welcome message"
                style={{
                  background: "#fff",
                  color: "#000",
                  width: "480px",
                  height: "320px",
                }}
              ></iframe>
            </td>
            <td>
              <iframe
                srcDoc={data.previewWelcomeMessage}
                title="Welcome message"
                style={{
                  background: "#fff",
                  color: "#000",
                  width: "480px",
                  height: "320px",
                }}
              ></iframe>
            </td>
          </tr>
          <tr>
            <td>{data.welcomeMessageSize} bytes</td>
            <td>{data.previewWelcomeMessageSize} bytes</td>
          </tr>
          <tr>
            <td>
              <textarea
                readOnly
                value={data.welcomeMessage}
                className="form-control"
                rows={10}
              />
            </td>
            <td>
              <textarea
                readOnly
                value={data.previewWelcomeMessage}
                className="form-control"
                rows={10}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <Form method="post">
        <input type="submit" value="Synchronize" className="btn btn-primary" />
      </Form>
    </>
  );
}
