using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace discdebug
{
    class binfo
    {
        public string name { get; set; }
    }

    public class Program
    {
        public static void Main()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Title = "DISCORD DEBUGGER v1.0";
            Console.WriteLine("Starting discord debugger instance.");
            Console.WriteLine("Finding discord...");
            var path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Discord";

            List<string> dirs = new List<string>(Directory.EnumerateDirectories(path));
            foreach (var dir in dirs)
            {
                if(dir.StartsWith(path + "\\app-"))
                {
                    path = dir;
                }
            }
        
            Console.WriteLine("Found discord at: " + path);
            Console.WriteLine("Starting program.");
            Console.WriteLine("");
            Console.ForegroundColor = ConsoleColor.Cyan;

            Process proc = new Process();
            proc.StartInfo.FileName = path + "\\Discord.exe";
            proc.EnableRaisingEvents = true;

            proc.Start();
            proc.Close();

            Console.ReadKey();
        }
    }
}