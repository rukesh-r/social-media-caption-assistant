import { useEffect, useState } from "react";
import axios from "axios";


function History() {

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);


  // ============================================================
  // LOAD HISTORY
  // ============================================================

  const loadHistory = async () => {

    try {

      setLoading(true);


      const response =
        await axios.get(
          "http://127.0.0.1:5000/history"
        );


      if (response.data.success) {

        setHistory(
          response.data.history
        );

      }

    }

    catch (error) {

      console.error(
        "Unable to load history:",
        error
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ============================================================
  // DELETE
  // ============================================================

  const deleteHistory = async (
    id
  ) => {

    try {

      await axios.delete(
        `http://127.0.0.1:5000/history/${id}`
      );


      setHistory(
        history.filter(
          item => item.id !== id
        )
      );

    }

    catch (error) {

      console.error(
        "Unable to delete history:",
        error
      );

    }

  };


  // ============================================================
  // LOAD ON START
  // ============================================================

  useEffect(() => {

    loadHistory();

  }, []);


  // ============================================================
  // UI
  // ============================================================

  return (

    <section className="mt-10">

      <div className="bg-white rounded-2xl border shadow-sm p-7">


        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h3 className="text-2xl font-bold">

              📜 Caption History

            </h3>


            <p className="text-gray-500 mt-1">

              View your previously generated AI content.

            </p>

          </div>


          <button

            onClick={loadHistory}

            className="border px-4 py-2 rounded-xl text-sm hover:bg-gray-50"

          >

            🔄 Refresh

          </button>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="text-center py-10">

            🤖 Loading history...

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          history.length === 0 && (

            <div className="bg-slate-50 border rounded-xl p-10 text-center">

              <div className="text-5xl mb-4">

                📭

              </div>


              <p className="text-gray-500">

                No caption history yet.

              </p>

            </div>

          )}


        {/* HISTORY */}

        {!loading &&
          history.length > 0 && (

            <div className="space-y-4">

              {history.map(
                (item) => (

                  <div

                    key={item.id}

                    className="border rounded-xl p-5"

                  >

                    <div className="flex justify-between items-start gap-4">

                      <div>

                        <div className="flex gap-2 mb-2">

                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">

                            {item.type}

                          </span>


                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">

                            {item.platform}

                          </span>

                        </div>


                        <p className="font-medium">

                          {item.input_text}

                        </p>


                        <p className="text-xs text-gray-400 mt-2">

                          {new Date(
                            item.created_at
                          ).toLocaleString()}

                        </p>

                      </div>


                      <button

                        onClick={() =>
                          deleteHistory(
                            item.id
                          )
                        }

                        className="text-red-500 text-sm hover:text-red-700"

                      >

                        🗑️ Delete

                      </button>

                    </div>


                    {/* RESULT */}

                    {item.result?.caption && (

                      <div className="mt-4 bg-slate-50 rounded-xl p-4">

                        <p className="text-sm text-gray-500 mb-1">

                          Generated Caption

                        </p>


                        <p>

                          {item.result.caption}

                        </p>

                      </div>

                    )}


                    {item.result?.rewritten_caption && (

                      <div className="mt-4 bg-purple-50 rounded-xl p-4">

                        <p className="text-sm text-gray-500 mb-1">

                          Rewritten Caption

                        </p>


                        <p>

                          {
                            item.result.rewritten_caption
                          }

                        </p>

                      </div>

                    )}


                    {item.result?.score !== undefined && (

                      <div className="mt-4 bg-green-50 rounded-xl p-4">

                        <p className="text-sm text-gray-500 mb-1">

                          Caption Analysis Score

                        </p>


                        <p className="text-2xl font-bold text-green-600">

                          {item.result.score}/100

                        </p>


                        <p className="text-sm">

                          {item.result.grade}

                        </p>

                      </div>

                    )}

                  </div>

                )

              )}

            </div>

          )}

      </div>

    </section>

  );

}


export default History;