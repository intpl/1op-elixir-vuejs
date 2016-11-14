defmodule Backend.RoomChannel do
  use Backend.Web, :channel
  alias Backend.Presence

  def join(room_id, %{"params" => %{"sha512" => sha512}}, socket) do
    ets_lookup(room_id) |> verify_room(room_id, sha512) |> prepare_response(room_id, socket, self)
  end

  def handle_info({:after_join, user_id}, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(
                              socket,
                              socket.id,
                              %{user_id: user_id})
    {:noreply, socket}
  end

	def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg", %{body: body}
    {:noreply, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
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

  defp prepare_response(:ok, room_id, socket, that) do
    send that, {:after_join, generate_user_id(room_id)}
    {:ok, socket}
  end

  defp prepare_response(:error, _, _, _) do
    {:error, %{ reason: "invalid password" }}
  end
end
