defmodule Hangman.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
        secret: random_secret(),
        lastGuess: [],
        bulls: 0,
        cows: 0,
        lives: 8,
      }
  end


    def guess(st, gs) do
    if(valid(gs)) do
      %{ st | lastGuess: gs,
        lives: st.lives - 1,
        bulls: getBulls(gs, st.secret),
        cows: getCows(gs, st.secret),
      }
    else
      %{lastGuess: st.lastGuess,
      lives: st.lives,
      bulls: st.bulls,
      cows: st.cows,
    }
    end
  end

    def view(st, name) do
    # bnc = bullsAndCows(st.lastGuess, st.code)
    %{

      bulls: st.bulls,
      cows: st.cows,
      lastGuess: st.lastGuess,
      lives: st.lives,
      name: name,
    }
  end

  def random_secret() do
    d_l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    d_s = Enum.shuffle(d_l)
    u1 = hd(d_s)
    u2 = hd(tl(d_s))
    u3 = hd(tl(tl(d_s)))
    u4 = hd(tl(tl(tl(d_s))))
    Integer.to_string(u1) <> Integer.to_string(u2) <> Integer.to_string(u3) <> Integer.to_string(u4)
  end

     def valid(g) do
    set_g_size = g
                |> String.codepoints
                |> Enum.chunk(1)
                |> Enum.map(&Enum.join/1)
                |> MapSet.new()
                |> MapSet.size()
    String.length(g) == 4 and set_g_size == 4
  end


  def indexOf(l, el) do
    tls = Enum.with_index(l)
    mp = Enum.map(tls, fn m -> Tuple.to_list(m) end)
    fl = Enum.filter(mp, fn e -> (Enum.at(e, 0) == el) end)
    Enum.at(Enum.at(fl, 0), 1)
  end


  def getBulls(g, sc) do
    ge = Enum.filter(String.split(g,""), fn x -> x != "" end)
    se = Enum.filter(String.split(sc,""), fn x -> x != "" end)
    zp = Enum.zip(ge, se)
    flt = Enum.filter(zp, fn x -> Enum.at(Tuple.to_list(x), 0) == Enum.at(Tuple.to_list(x), 1) end)
    Enum.count(flt)
  end

  def getCows(g, sc) do
    ge = Enum.filter(String.split(g,""), fn x -> x != "" end)
    se = Enum.filter(String.split(sc,""), fn x -> x != "" end)
    Enum.count(Enum.filter(ge, fn el -> Enum.member?(se, el) end)) - getBulls(g, sc)
  end
end
