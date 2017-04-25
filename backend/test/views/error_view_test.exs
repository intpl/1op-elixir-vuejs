defmodule Backend.ErrorViewTest do
  use Backend.ConnCase, async: true

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  test "renders 404.json" do
    assert render(Backend.ErrorView, "404.json", []) ==
           %{errors: ['page not found']}
  end

  test "render 500.json" do
    assert render(Backend.ErrorView, "500.json", []) ==
           %{errors: ['page not found']}
  end

  test "render any other" do
    assert render(Backend.ErrorView, "505.json", []) ==
           %{errors: ['page not found']}
  end
end
