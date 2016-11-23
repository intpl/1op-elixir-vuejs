defmodule Backend.RoomChannel do
  use Backend.Web, :channel
  alias Backend.Presence

@hex_chars "0123456789abcdef" |> String.split("")

  intercept ["new_msg"]

  def join(room_id, %{"params" => %{"sha512" => sha512, "rsa_pub" => rsa_pub}}, socket) do
    room_id
      |> ets_lookup
      |> sync_room(room_id, sha512)
      |> handle_response(room_id, rsa_pub, socket, self)
  end

  def terminate(_reason, socket) do
    :ok = handle_leaving(socket.topic, Presence.list(socket))

    {:ok, socket}
  end

  def handle_info({:after_join, _, rsa_pub}, socket) do
    presence_list = Presence.list(socket)
    socket = assign(socket, :user_color, generate_random_color)
    push socket, "presence_state", presence_list

    {:ok, _} = Presence.track( socket, socket.id, %{
                                user_color: socket.assigns[:user_color],
                                rsa_pub: rsa_pub
                              })
    {:noreply, socket}
  end

	def handle_in("new_msg", params, socket) do
    broadcast! socket, "new_msg",
      %{body: params["body"], sender_color: socket.assigns[:user_color]}

    {:noreply, socket}
  end

  def handle_out("new_msg", %{body: body, sender_color: sender_color}, socket) do
    user_color = socket.assigns[:user_color]

    [ _ | [ message ] ] = Enum.find(body, fn([user | _]) -> user == user_color end)

    push socket, "new_msg", %{body: [sender_color, message]}
    {:noreply, socket}
  end

  defp generate_random_color do
		Enum.reduce((1..6), [], fn (_i, acc) ->
      [Enum.random(@hex_chars) | acc]
    end) |> Enum.join("")
  end

  defp ets_lookup(room_id), do: :ets.lookup(:chatrooms, room_id)

  defp sync_room([{room_id, sha512}], room_id, sha512), do: :ok
  defp sync_room([], room_id, sha512) do
    :ets.insert(:chatrooms, { room_id, sha512 })
    :ok
  end

  defp sync_room(_, _, _), do: :error

  defp handle_response(:ok, room_id, rsa_pub, socket, join_self) do
    send join_self, {:after_join, room_id, rsa_pub}
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
