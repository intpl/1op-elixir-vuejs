defmodule Backend.Router do
  use Backend.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Backend do
    get "/ping", PageController, :ping

    scope "/api" do
      pipe_through :api
    end
  end
end
