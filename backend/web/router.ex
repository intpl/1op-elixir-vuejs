defmodule Backend.Router do
  use Backend.Web, :router

  scope "/", Backend do
    get "/", PageController, :red
  end
end
