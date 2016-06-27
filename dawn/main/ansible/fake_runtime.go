package main

import "time"
import "os/exec"
import "bufio"
import "bytes"
import "github.com/golang/protobuf/proto"
import "net"

func ansible_send(outbound chan []byte) {
	conn, _ := net.Dial("udp", "127.0.0.1:12345")
	defer conn.Close()
	for {
		message := <- outbound
		conn.Write(message)
	}
}

func wrap_ansible_message(message_type string, data []byte) []byte {
	ansible_msg := &AnsibleMessage{
		Type: message_type,
		Data: data,
	}
	message, _ := proto.Marshal(ansible_msg)
	return message
}

func send_output(output chan string, outbound chan []byte) {
	var buffer bytes.Buffer
	ticker := time.Tick(100 * time.Millisecond)
	for {
		select {
		case content := <- output:
			buffer.WriteString(content)
		case <- ticker:
			output_string := buffer.String()
			if len(output_string) > 0 {
				proto_msg := &ConsoleOutput{
					Output: output_string,
				}
				data, _ := proto.Marshal(proto_msg)
				message := wrap_ansible_message("ConsoleOutput", data)
				outbound <- message
			}
			buffer.Reset()
		}
	}
}

func run_student_code(outbound chan []byte) {
	student_code := exec.Command("python", "-u", "student_code.py")
	student_out, _ := student_code.StdoutPipe()
	student_code.Start()
	in := bufio.NewScanner(student_out)
	output := make(chan string)
	go send_output(output, outbound)
	for {
		in.Scan()
		output <- in.Text()
	}
}

func main() {
	outbound := make(chan []byte)
	go ansible_send(outbound)
	go run_student_code(outbound)
	for {}
}
