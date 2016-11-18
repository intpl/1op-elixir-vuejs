defmodule Backend.RoomChannel do
  use Backend.Web, :channel
  alias Backend.Presence

  intercept ["new_msg"]

  def join(room_id, %{"params" => %{"sha512" => sha512, "rsa_pub" => rsa_pub}}, socket) do
    room_id
      |> ets_lookup
      |> verify_room(room_id, sha512)
      |> handle_response(room_id, rsa_pub, socket, self)
  end

  def terminate(_reason, socket) do
    :ok = handle_leaving(socket.topic, Presence.list(socket))

    {:ok, socket}
  end

  def handle_info({:after_join, room_id, rsa_pub}, socket) do
    socket = assign(socket, :user_id, generate_user_id(room_id))
    push socket, "presence_state", Presence.list(socket)

    {:ok, _} = Presence.track( socket, socket.id, %{
                                user_id: socket.assigns[:user_id],
                                rsa_pub: rsa_pub
                              })
    {:noreply, socket}
  end

	def handle_in("new_msg", body, socket) do
    broadcast! socket, "new_msg", body
    {:noreply, socket}
  end

  def handle_out("new_msg", %{"body" => body}, socket) do
    user_id = socket.assigns[:user_id]

    [ _ | message ] = Enum.find(body, fn([user | _]) -> user == user_id end)

    push socket, "new_msg", %{body: message}
    {:noreply, socket}
  end

  defp generate_user_id(room_id), do: "user_" <> Integer.to_string count_user_id(Presence.list(room_id))
  defp count_user_id(%{"" => %{ metas: arr }}), do: Enum.count arr
  defp count_user_id(%{}), do: 0

  defp ets_lookup(room_id), do: :ets.lookup(:chatrooms, room_id)

  defp verify_room([{room_id, sha512}], room_id, sha512), do: :ok
  defp verify_room([], room_id, sha512) do
    :ets.insert(:chatrooms, { room_id, sha512 })
    :ok
  end

  defp verify_room(_, _, _), do: :error

  defp handle_response(:ok, room_id, rsa_pub, socket, that) do
    send that, {:after_join, room_id, rsa_pub}
    {:ok, socket}
  end

  defp handle_response(:error, _, _, _, _) do
    {:error, %{ reason: "invalid password" }}
  end

  defp handle_leaving(room_id, %{}) do
    case ets_lookup(room_id) do
      [{_, _}] -> :ets.delete(:chatrooms, room_id)
      [] -> :ok
    end

    :ok
  end

  defp handle_leaving(_, _), do: :ok # lol
end
