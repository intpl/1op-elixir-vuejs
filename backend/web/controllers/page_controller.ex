defmodule Backend.PageController do
  use Phoenix.Controller

  def red(conn, _params) do
    redirect conn, external: Application.get_env(:backend, :frontend_host)
  end
end
