from mutagen.id3 import ID3, ID3NoHeaderError 
import os, sys 
mypath = '/media/iprohorov/ESD-ISO' 
def getTagsToTxt(path):
    files = os.listdir(path)
    music = list(filter(lambda x: x.endswith('.mp3'), files))
    file = open('parserchik.txt', 'w')
    for i in music:
        print(i)
	file.write("Name: ")
	#file.write(path)
	#file.write("/")
        file.write(i + "\n")
        try:
            audio = ID3(path + "/" + i)
        except ID3NoHeaderError:
            print(None)
            print()
            file.write("-\n")
            file.write("\n")
            continue
        try:
            print("Artist: %s" % audio['TPE1'].text[0])
            file.write("Artist: %s\n" % audio['TPE1'].text[0])
        except KeyError:
            print(None)
            file.write("Artist: -\n")
        try:
            print("Track: %s" % audio["TIT2"].text[0])
            file.write("Track: %s\n" % audio["TIT2"].text[0])
        except KeyError:
            print(None)
            file.write("Track: -\n")
        try:
            print("Album: %s" % audio["TALB"].text[0])
            file.write("Album: %s\n" % audio["TALB"].text[0])
        except KeyError:
            print(None)
            file.write("Album: -\n")
        try:
            print("Release Year: %s" % audio["TDRC"].text[0])
            file.write("Release Year: %s\n" % audio["TDRC"].text[0])
        except KeyError:
            print(None)
            file.write("Release Year: -\n")
        print()
        file.write("\n")
    file.close()
path = "/media/iprohorov/" 
if os.path.isdir(path):
	dirs = os.listdir( path )
# This would print all the files and directories
        for file in dirs:
                getTagsToTxt(path+file) 
