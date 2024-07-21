package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type WSMSG struct {
	Signal WSSIGNAL
	Code   int
	Error  string
	Data   interface{}
	Path   string
}

type WSSIGNAL int

const (
	ping WSSIGNAL = iota + 1
	pong
	readFile
	writeFile
	walkDir

	// maybe it's enough to just send line/col back and go just does it's thing.
	getAnalytics
	getAnalyticsSymbol
	getAnalyticsFunction
	getAnalyticsModule

	// MAYBE ?
	getSymbol
)

var (
	httpServer  = fiber.New()
	bindAddress = "0.0.0.0:7744"
)

func main() {
	pwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	fmt.Println("ROOT:", pwd)
	cancelContext, cancel := context.WithCancel(context.Background())
	defer cancel()

	RunServer(cancelContext, bindAddress)
}

func RunServer(ctx context.Context, bind string) (err error) {
	err = startAPIandWS(ctx, bind)
	if err != nil {
		return
	}

	return nil
}

func startAPIandWS(ctx context.Context, bind string) (err error) {
	httpServer.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	httpServer.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	httpServer.Get("/control", websocket.New(func(con *websocket.Conn) {
		// log.Println(c.Locals("allowed"))  // true
		// log.Println(c.Params("id"))       // 123
		// log.Println(c.Cookies("session")) // ""

		var (
			mt  int
			msg []byte
			err error
		)

		// err = SendPing(con)
		// if err != nil {
		// 	fmt.Println("Unable to accept client:", err)
		// 	if con != nil {
		// 		con.Close()
		// 	}
		// 	return
		// }

		for {
			if ctx.Err() != nil {
				return
			}
			if mt, msg, err = con.ReadMessage(); err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %d %s", mt, msg)

			m := new(WSMSG)
			err := json.Unmarshal(msg, m)
			if err != nil {
				fmt.Println("Unable to parse signal:", err)
				continue
			}

			fmt.Println("M:", m.Signal)
			switch m.Signal {
			case ping:
			case pong:
				fmt.Println("PONG !!!")
			case readFile:
				file, err := ReadFile(m.Path)
				if err != nil {
					panic(err)
				}
				err = con.WriteMessage(1, file)
				if err != nil {
					panic(err)
				}

			case writeFile:
				fmt.Println("WRITEFILE !!!")
			case walkDir:
			case getAnalytics:
			default:
				fmt.Println("unrecognized command")
			}
		}
	}))

	fmt.Println("Binding to:", bind)
	go func() {
		err = httpServer.Listen(bind)
		if err != nil {
			fmt.Println(err)
		}
	}()

	for {
		time.Sleep(1 * time.Second)
		if ctx.Err() != nil {
			httpServer.Shutdown()
			return
		}
	}
}
