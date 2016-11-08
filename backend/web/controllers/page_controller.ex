defmodule Backend.PageController do
  use Phoenix.Controller

  def ping(conn, _params) do
    text conn, "pong"
  end
end
