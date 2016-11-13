defmodule Backend.RoomChannel do
  use Backend.Web, :channel
  alias Backend.Presence

  defp generate_user_id(res), do: "user_" <> Integer.to_string count_user_id(res)
  defp count_user_id(%{"" => %{ metas: arr }}), do: Enum.count arr
  defp count_user_id(%{}), do: 0

  def join(room_id, %{"params" => %{"sha512" => sha512}}, socket) do
    case :ets.lookup(:chatrooms, room_id) do
      [] -> :ets.insert(:chatrooms, { room_id, sha512 })
      [{ ^room_id, ^sha512 }] -> # TODO: do nothing, just ensure this or crash. refactor me, maybe? :)
    end

    send self, {:after_join, generate_user_id(Presence.list(room_id))}
    { :ok, socket }
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
end
