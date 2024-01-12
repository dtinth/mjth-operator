import { LoaderFunctionArgs, defer } from "@remix-run/node";
import { UserButton } from "@clerk/remix";
import { db } from "~/db.server";
import { serversTable } from "~/schema.server";
import { Link, useLoaderData } from "@remix-run/react";
import { trpc } from "~/utils/trpc";
import { ensureLoggedIn } from "~/utils/ensureLoggedIn";

export const loader = async (args: LoaderFunctionArgs) => {
  await ensureLoggedIn(args);
  const serverList = await db.select().from(serversTable).all();
  return defer({
    servers: serverList.map((info) => {
      return {
        id: info.id,
        url: info.url,
      };
    }),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <div style={{ float: "right" }}>
        <UserButton />
      </div>
      <h1>Servers</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>Clients</th>
            <th>Server Profile</th>
          </tr>
        </thead>
        <tbody>
          {data.servers.map((server) => {
            return (
              <tr key={server.id}>
                <td>
                  <Link to={`/servers/${server.id}/welcome`}>{server.id}</Link>
                </td>
                <td>{server.url}</td>
                <td>
                  <ServerClients serverId={server.id} />
                </td>
                <td>
                  <ServerProfile serverId={server.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ServerClients(props: { serverId: string }) {
  const { data, error } = trpc.getClients.useQuery({
    serverId: props.serverId,
  });
  if (!data) {
    return error ? String(error) : "Loading...";
  }
  type JamulusClient = {
    address: string;
    channels: number;
    id: number;
    jitterBufferSize: number;
    name: string;
  };
  return (
    <>
      <table className="table table-sm border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Channels</th>
            <th>Jitter</th>
          </tr>
        </thead>
        <tbody>
          {(data.clients || []).map((client: JamulusClient) => {
            return (
              <tr key={client.id} onClick={() => console.log(client)}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.channels}</td>
                <td>{client.jitterBufferSize}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
function ServerProfile(props: { serverId: string }) {
  const { data, error } = trpc.getServerProfile.useQuery({
    serverId: props.serverId,
  });
  if (!data) {
    return error ? String(error) : "Loading...";
  }
  return (
    <>
      <table className="table table-sm border">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            if (key === "welcomeMessage") {
              return null;
            }
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{String(value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
